package com.example.minigram;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Dados locais do MiniGram. Não há servidor nem sincronização entre celulares.
 * Uma mesma classe gerencia perfil e posts para que a tela inicial seja a única timeline.
 */
public final class MiniGramData {

    // Mantido igual ao complemento anterior para aproveitar perfis já cadastrados.
    private static final String PREFERENCIAS = "minigram_demo_offline";
    private static final String CHAVE_POSTS = "publicacoes";

    private MiniGramData() { }

    public static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFERENCIAS, Context.MODE_PRIVATE);
    }

    public static String apelido(Context context) {
        return prefs(context).getString("apelido", "").trim();
    }

    public static String biografia(Context context) {
        return prefs(context).getString("biografia", "").trim();
    }

    public static String fotoPerfil(Context context) {
        return prefs(context).getString("fotoPerfil", "");
    }

    public static void salvarPerfil(Context contexto, String apelido, String biografia, String foto) {
        prefs(contexto).edit()
                .putString("apelido", apelido)
                .putString("biografia", biografia)
                .putString("fotoPerfil", foto == null ? "" : foto)
                .apply();
    }

    /** Estrutura simples de uma publicação, armazenada como JSON no próprio celular. */
    public static class Publicacao {
        public String autor = "";
        public String texto = "";
        public String fotoAutor = "";
        public ArrayList<String> fotos = new ArrayList<>();
        public ArrayList<String> comentarios = new ArrayList<>();
        public long data = System.currentTimeMillis();
        public int curtidas = 0;
        public boolean curtida = false;
        public boolean minha = false;
        public boolean demonstracao = false;

        JSONObject paraJson() {
            JSONObject json = new JSONObject();
            try {
                json.put("autor", autor);
                json.put("texto", texto);
                json.put("fotoAutor", fotoAutor);
                json.put("imagens", new JSONArray(fotos));
                json.put("comentarios", new JSONArray(comentarios));
                json.put("criadoEm", data);
                json.put("curtidas", curtidas);
                json.put("curtida", curtida);
                json.put("propria", minha);
                json.put("exemplo", demonstracao);
            } catch (Exception ignored) { }
            return json;
        }

        static Publicacao deJson(JSONObject json) {
            Publicacao post = new Publicacao();
            post.autor = json.optString("autor", "Visitante");
            post.texto = json.optString("texto", "");
            post.fotoAutor = json.optString("fotoAutor", "");
            post.data = json.optLong("criadoEm", System.currentTimeMillis());
            post.curtidas = json.optInt("curtidas", 0);
            post.curtida = json.optBoolean("curtida", false);
            post.minha = json.optBoolean("propria", false);
            post.demonstracao = json.optBoolean("exemplo", false);

            JSONArray fotosJson = json.optJSONArray("imagens");
            if (fotosJson != null) {
                for (int i = 0; i < fotosJson.length(); i++) {
                    String caminho = fotosJson.optString(i, "");
                    if (!caminho.isEmpty()) post.fotos.add(caminho);
                }
            } else {
                // Compatibilidade com as publicações do complemento anterior.
                String fotoAntiga = json.optString("fotoPublicacao", "");
                if (!fotoAntiga.isEmpty()) post.fotos.add(fotoAntiga);
            }

            JSONArray comentariosJson = json.optJSONArray("comentarios");
            if (comentariosJson != null) {
                for (int i = 0; i < comentariosJson.length(); i++) {
                    post.comentarios.add(comentariosJson.optString(i));
                }
            }
            return post;
        }
    }

    public static ArrayList<Publicacao> carregarPublicacoes(Context context) {
        SharedPreferences prefs = prefs(context);
        ArrayList<Publicacao> lista = new ArrayList<>();

        if (!prefs.contains(CHAVE_POSTS)) {
            // Posts fictícios apenas para demonstração; não vieram de outros celulares.
            lista.add(exemplo("Marina", "Hoje estamos apresentando o MiniGram na escola! 📱", 12, 25));
            lista.add(exemplo("Pedro", "Aprendendo a desenvolver aplicativos Android com Java e XML.", 8, 80));
            lista.add(exemplo("Equipe MiniGram", "Bem-vindos ao MiniGram! Esta timeline funciona offline.", 15, 150));
            salvarPublicacoes(context, lista);
            return lista;
        }

        try {
            JSONArray dados = new JSONArray(prefs.getString(CHAVE_POSTS, "[]"));
            for (int i = 0; i < dados.length(); i++) {
                JSONObject item = dados.optJSONObject(i);
                if (item != null) lista.add(Publicacao.deJson(item));
            }
        } catch (Exception ignored) { }
        return lista;
    }

    private static Publicacao exemplo(String autor, String texto, int curtidas, int minutos) {
        Publicacao p = new Publicacao();
        p.autor = autor;
        p.texto = texto;
        p.curtidas = curtidas;
        p.data -= minutos * 60_000L;
        p.demonstracao = true;
        return p;
    }

    public static void salvarPublicacoes(Context context, ArrayList<Publicacao> publicacoes) {
        JSONArray json = new JSONArray();
        for (Publicacao post : publicacoes) json.put(post.paraJson());
        prefs(context).edit().putString(CHAVE_POSTS, json.toString()).apply();
    }

    /**
     * Copia a foto selecionada para a área privada do aplicativo.
     * Isso é necessário para ela continuar acessível depois que o app é fechado.
     */
    public static String guardarFoto(Context context, Uri origem) throws IOException {
        if (origem == null) throw new IOException("Nenhuma imagem selecionada.");
        File pasta = new File(context.getFilesDir(), "imagens_minigram");
        if (!pasta.exists() && !pasta.mkdirs()) throw new IOException("Não foi possível criar pasta.");
        File destino = new File(pasta, UUID.randomUUID().toString() + ".img");
        try (InputStream entrada = context.getContentResolver().openInputStream(origem);
             FileOutputStream saida = new FileOutputStream(destino)) {
            if (entrada == null) throw new IOException("Imagem não pôde ser aberta.");
            byte[] buffer = new byte[8192];
            int tamanho;
            long total = 0;
            while ((tamanho = entrada.read(buffer)) != -1) {
                total += tamanho;
                if (total > 15L * 1024L * 1024L) {
                    throw new IOException("Imagem muito grande. Limite: 15 MB.");
                }
                saida.write(buffer, 0, tamanho);
            }
        } catch (IOException erro) {
            // Evita deixar arquivos incompletos.
            destino.delete();
            throw erro;
        }
        return Uri.fromFile(destino).toString();
    }
}

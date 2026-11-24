package com.example.minigram;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * MINI GRAM - TELA INICIAL = TIMELINE.
 * Aqui ficam TODAS as publicações: antigas de demonstração e novas do usuário.
 * A tela de perfil é separada e não contém outro feed.
 */
public class MainActivity extends AppCompatActivity {

    private final ArrayList<Uri> imagensSelecionadas = new ArrayList<>();
    private ArrayList<MiniGramData.Publicacao> publicacoes = new ArrayList<>();

    private EditText edtTexto;
    private TextView txtAnexo, txtNome, txtUsuario;
    private ImageView imagemCabecalho;
    private LinearLayout previewImagens, feed;
    private HorizontalScrollView scrollPreview;
    private ActivityResultLauncher<String> seletorFotos;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // A tela original continua responsável pela composição e pelo feed.
        edtTexto = findViewById(R.id.edtTexto);
        txtAnexo = findViewById(R.id.txtAnexo);
        txtNome = findViewById(R.id.txtNome);
        txtUsuario = findViewById(R.id.txtUsuario);
        imagemCabecalho = findViewById(R.id.imagemCabecalho);
        previewImagens = findViewById(R.id.previewImagens);
        feed = findViewById(R.id.feed);
        scrollPreview = findViewById(R.id.scrollPreview);

        // O clique no cabeçalho compacto abre SOMENTE o perfil.
        findViewById(R.id.cabecalhoPerfil).setOnClickListener(v ->
                startActivity(new Intent(this, ProfileActivity.class)));

        // Seletor de até cinco fotos, igual à proposta original do MiniGram.
        seletorFotos = registerForActivityResult(
                new ActivityResultContracts.GetMultipleContents(),
                this::receberImagens);
        findViewById(R.id.btnFoto).setOnClickListener(v -> seletorFotos.launch("image/*"));
        findViewById(R.id.btnPublicar).setOnClickListener(v -> publicar());

        publicacoes = MiniGramData.carregarPublicacoes(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Reflete na timeline quaisquer alterações feitas no perfil.
        atualizarCabecalho();
        mostrarTimeline();
    }

    private void atualizarCabecalho() {
        String nome = MiniGramData.apelido(this);
        String bio = MiniGramData.biografia(this);
        txtNome.setText(nome.isEmpty() ? "Meu perfil" : nome);
        txtUsuario.setText(nome.isEmpty() ? "Toque para configurar" :
                (bio.isEmpty() ? "Toque para editar perfil" : bio));
        colocarAvatar(imagemCabecalho, MiniGramData.fotoPerfil(this));
    }

    private void receberImagens(List<Uri> imagens) {
        imagensSelecionadas.clear();
        previewImagens.removeAllViews();
        if (imagens == null || imagens.isEmpty()) {
            scrollPreview.setVisibility(View.GONE);
            txtAnexo.setText("");
            return;
        }
        int quantidade = Math.min(5, imagens.size());
        for (int i = 0; i < quantidade; i++) {
            Uri uri = imagens.get(i);
            imagensSelecionadas.add(uri);
            ImageView img = criarImagem(uri.toString(), 92, 92);
            previewImagens.addView(img);
        }
        txtAnexo.setText(quantidade == 1 ? "1 imagem selecionada" :
                quantidade + " imagens selecionadas (máximo: 5)");
        scrollPreview.setVisibility(View.VISIBLE);
    }

    private void publicar() {
        String texto = edtTexto.getText().toString().trim();
        if (texto.isEmpty() && imagensSelecionadas.isEmpty()) {
            aviso("Escreva algo ou selecione uma imagem.");
            return;
        }
        if (texto.length() > 280) {
            edtTexto.setError("Máximo de 280 caracteres.");
            return;
        }
        MiniGramData.Publicacao post = new MiniGramData.Publicacao();
        post.autor = MiniGramData.apelido(this);
        post.fotoAutor = MiniGramData.fotoPerfil(this);
        post.texto = texto;
        post.minha = true;
        post.demonstracao = false;

        // Cópias locais permitem visualizar as imagens mesmo após reiniciar o app.
        try {
            for (Uri uri : imagensSelecionadas) {
                post.fotos.add(MiniGramData.guardarFoto(this, uri));
            }
        } catch (Exception erro) {
            aviso("Erro ao salvar imagem: " + erro.getMessage());
            return;
        }

        publicacoes.add(0, post);
        MiniGramData.salvarPublicacoes(this, publicacoes);
        mostrarTimeline();
        edtTexto.setText("");
        imagensSelecionadas.clear();
        previewImagens.removeAllViews();
        scrollPreview.setVisibility(View.GONE);
        txtAnexo.setText("");
        aviso("Publicação adicionada à timeline.");
    }

    /** A timeline é exibida exclusivamente nesta tela inicial. */
    private void mostrarTimeline() {
        if (feed == null) return;
        feed.removeAllViews();
        for (MiniGramData.Publicacao post : publicacoes) {
            criarPublicacao(post);
        }
    }

    private void criarPublicacao(MiniGramData.Publicacao post) {
        // Mantemos fundo escuro e tipografia do MiniGram ORIGINAL.
        LinearLayout caixa = new LinearLayout(this);
        caixa.setOrientation(LinearLayout.VERTICAL);
        caixa.setPadding(dp(13), dp(14), dp(13), dp(14));
        caixa.setBackground(fundo(0xFF201D26, 14, 0xFF302A38));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.setMargins(dp(12), dp(5), dp(12), dp(10));
        feed.addView(caixa, lp);

        LinearLayout cabecalhoPost = new LinearLayout(this);
        cabecalhoPost.setGravity(Gravity.CENTER_VERTICAL);
        cabecalhoPost.setOrientation(LinearLayout.HORIZONTAL);
        caixa.addView(cabecalhoPost);

        ImageView avatar = new ImageView(this);
        LinearLayout.LayoutParams avatarLp = new LinearLayout.LayoutParams(dp(38), dp(38));
        avatarLp.setMargins(0, 0, dp(10), 0);
        cabecalhoPost.addView(avatar, avatarLp);
        colocarAvatar(avatar, post.minha ? MiniGramData.fotoPerfil(this) : post.fotoAutor);
        if (post.minha) {
            avatar.setOnClickListener(v -> startActivity(new Intent(this, ProfileActivity.class)));
        }

        LinearLayout textosAutor = new LinearLayout(this);
        textosAutor.setOrientation(LinearLayout.VERTICAL);
        cabecalhoPost.addView(textosAutor, new LinearLayout.LayoutParams(0, -2, 1f));

        String autor = post.minha ? MiniGramData.apelido(this) : post.autor;
        if (autor == null || autor.trim().isEmpty()) autor = "visitante";
        textosAutor.addView(texto("@" + autor, 16, 0xFFEAE4F3, true));
        String data = new SimpleDateFormat("dd/MM · HH:mm", Locale.getDefault())
                .format(new Date(post.data));
        textosAutor.addView(texto(data + (post.demonstracao ? " · Exemplo" : ""),
                12, 0xFFAC9FB9, false));

        if (post.minha) {
            TextView excluir = texto("Excluir", 13, 0xFFD8B5E7, false);
            excluir.setPadding(dp(8), dp(8), 0, dp(8));
            cabecalhoPost.addView(excluir);
            excluir.setOnClickListener(v -> new AlertDialog.Builder(this)
                    .setTitle("Excluir publicação?")
                    .setMessage("A publicação será removida deste aparelho.")
                    .setNegativeButton("Cancelar", null)
                    .setPositiveButton("Excluir", (dialogo, qual) -> {
                        publicacoes.remove(post);
                        MiniGramData.salvarPublicacoes(this, publicacoes);
                        mostrarTimeline();
                    }).show());
        }

        if (!post.texto.isEmpty()) {
            TextView corpo = texto(post.texto, 16, 0xFFE2DAE9, false);
            corpo.setPadding(0, dp(12), 0, dp(10));
            caixa.addView(corpo);
        }

        if (!post.fotos.isEmpty()) {
            HorizontalScrollView carrossel = new HorizontalScrollView(this);
            carrossel.setHorizontalScrollBarEnabled(false);
            LinearLayout imagens = new LinearLayout(this);
            imagens.setOrientation(LinearLayout.HORIZONTAL);
            for (String foto : post.fotos) {
                imagens.addView(criarImagem(foto, 280, 240));
            }
            carrossel.addView(imagens);
            caixa.addView(carrossel);
        }

        // Ações funcionais, salvas localmente. O feed não fica duplicado em outra tela.
        LinearLayout acoes = new LinearLayout(this);
        acoes.setGravity(Gravity.CENTER_VERTICAL);
        acoes.setOrientation(LinearLayout.HORIZONTAL);
        acoes.setPadding(0, dp(10), 0, 0);
        caixa.addView(acoes);

        TextView curtir = texto((post.curtida ? "♥ Curtido" : "♡ Curtir") +
                "  " + post.curtidas, 14, 0xFFD0BBFF, false);
        curtir.setPadding(0, dp(6), dp(22), dp(6));
        acoes.addView(curtir);
        curtir.setOnClickListener(v -> {
            post.curtida = !post.curtida;
            post.curtidas += post.curtida ? 1 : -1;
            MiniGramData.salvarPublicacoes(this, publicacoes);
            mostrarTimeline();
        });

        TextView comentar = texto("Comentar" + (post.comentarios.isEmpty() ? "" :
                "  " + post.comentarios.size()), 14, 0xFFD0BBFF, false);
        comentar.setPadding(0, dp(6), 0, dp(6));
        acoes.addView(comentar);
        comentar.setOnClickListener(v -> abrirComentarios(post));

        for (String comentario : post.comentarios) {
            TextView linha = texto("• " + comentario, 13, 0xFFCFC6D6, false);
            linha.setPadding(0, dp(4), 0, dp(2));
            caixa.addView(linha);
        }
    }

    private void abrirComentarios(MiniGramData.Publicacao post) {
        EditText entrada = new EditText(this);
        entrada.setSingleLine(false);
        entrada.setMaxLines(3);
        entrada.setHint("Escreva um comentário");
        LinearLayout container = new LinearLayout(this);
        container.setPadding(dp(20), dp(4), dp(20), 0);
        container.addView(entrada, new LinearLayout.LayoutParams(-1, -2));
        new AlertDialog.Builder(this)
                .setTitle("Comentar publicação")
                .setView(container)
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Enviar", (dialogo, qual) -> {
                    String comentario = entrada.getText().toString().trim();
                    if (!comentario.isEmpty()) {
                        String apelido = MiniGramData.apelido(this);
                        if (apelido.isEmpty()) apelido = "visitante";
                        post.comentarios.add("@" + apelido + ": " + comentario);
                        MiniGramData.salvarPublicacoes(this, publicacoes);
                        mostrarTimeline();
                    }
                }).show();
    }

    private void colocarAvatar(ImageView imagem, String caminho) {
        imagem.setScaleType(ImageView.ScaleType.CENTER_CROP);
        imagem.setBackground(fundo(0xFFB69BE7, 100, 0xFFB69BE7));
        imagem.setClipToOutline(true);
        imagem.setImageResource(R.drawable.ic_mg_profile);
        if (caminho != null && !caminho.trim().isEmpty()) {
            try {
                imagem.setImageURI(Uri.parse(caminho));
            } catch (Exception ignorado) {
                imagem.setImageResource(R.drawable.ic_mg_profile);
            }
        }
    }

    private ImageView criarImagem(String caminho, int largura, int altura) {
        ImageView img = new ImageView(this);
        img.setScaleType(ImageView.ScaleType.CENTER_CROP);
        try {
            img.setImageURI(Uri.parse(caminho));
        } catch (Exception erro) {
            img.setImageResource(android.R.drawable.ic_menu_gallery);
        }
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(largura), dp(altura));
        lp.setMargins(0, dp(4), dp(6), dp(4));
        img.setLayoutParams(lp);
        return img;
    }

    private TextView texto(String valor, int tamanho, int cor, boolean bold) {
        TextView view = new TextView(this);
        view.setText(valor);
        view.setTextSize(tamanho);
        view.setTextColor(cor);
        if (bold) view.setTypeface(null, Typeface.BOLD);
        return view;
    }

    private GradientDrawable fundo(int cor, int raio, int borda) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(cor);
        drawable.setCornerRadius(dp(raio));
        drawable.setStroke(dp(1), borda);
        return drawable;
    }

    private int dp(int valor) {
        return Math.round(valor * getResources().getDisplayMetrics().density);
    }

    private void aviso(String mensagem) {
        Toast.makeText(this, mensagem, Toast.LENGTH_SHORT).show();
    }
}

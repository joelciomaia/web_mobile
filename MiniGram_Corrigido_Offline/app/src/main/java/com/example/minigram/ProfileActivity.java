package com.example.minigram;

import android.net.Uri;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

/**
 * TELA DE PERFIL: somente foto, apelido e biografia.
 * Não tem timeline nem ferramenta de publicar, pois isso já existe na MainActivity.
 */
public class ProfileActivity extends AppCompatActivity {

    private EditText campoApelido, campoBio;
    private ImageView fotoPerfil;
    private String caminhoFoto;
    private ActivityResultLauncher<String> escolherFoto;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        campoApelido = findViewById(R.id.campoApelido);
        campoBio = findViewById(R.id.campoBio);
        fotoPerfil = findViewById(R.id.fotoPerfil);
        caminhoFoto = MiniGramData.fotoPerfil(this);

        campoApelido.setText(MiniGramData.apelido(this));
        campoBio.setText(MiniGramData.biografia(this));
        mostrarFoto();

        int meusPosts = 0;
        for (MiniGramData.Publicacao post : MiniGramData.carregarPublicacoes(this)) {
            if (post.minha) meusPosts++;
        }
        TextView contador = findViewById(R.id.txtContador);
        contador.setText(meusPosts == 1 ? "1 publicação" : meusPosts + " publicações");

        escolherFoto = registerForActivityResult(
                new ActivityResultContracts.GetContent(), this::receberFoto);

        findViewById(R.id.btnVoltar).setOnClickListener(v -> finish());
        findViewById(R.id.btnEscolherFoto).setOnClickListener(v -> escolherFoto.launch("image/*"));
        findViewById(R.id.btnSalvarPerfil).setOnClickListener(v -> salvar());
    }

    private void receberFoto(Uri uri) {
        if (uri == null) return;
        try {
            // A imagem é copiada para o armazenamento interno, sem internet.
            caminhoFoto = MiniGramData.guardarFoto(this, uri);
            mostrarFoto();
        } catch (Exception erro) {
            Toast.makeText(this, "Não foi possível carregar a foto.", Toast.LENGTH_SHORT).show();
        }
    }

    private void mostrarFoto() {
        fotoPerfil.setImageResource(R.drawable.ic_mg_profile);
        if (caminhoFoto != null && !caminhoFoto.isEmpty()) {
            try {
                fotoPerfil.setImageURI(Uri.parse(caminhoFoto));
            } catch (Exception ignored) { }
        }
    }

    private void salvar() {
        String apelido = campoApelido.getText().toString().trim();
        String biografia = campoBio.getText().toString().trim();

        if (apelido.length() < 2 || apelido.length() > 24) {
            campoApelido.setError("Use entre 2 e 24 caracteres.");
            campoApelido.requestFocus();
            return;
        }
        if (biografia.length() > 120) {
            campoBio.setError("Máximo de 120 caracteres.");
            campoBio.requestFocus();
            return;
        }
        MiniGramData.salvarPerfil(this, apelido, biografia, caminhoFoto);
        Toast.makeText(this, "Perfil salvo!", Toast.LENGTH_SHORT).show();
        // Ao voltar, o cabeçalho e os posts do usuário passam a mostrar o novo perfil.
        finish();
    }
}

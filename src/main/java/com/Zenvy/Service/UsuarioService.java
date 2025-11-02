package com.Zenvy.Service;


import com.Zenvy.Model.Enum.Role;
import com.Zenvy.Model.Usuario;
import com.Zenvy.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario salvarImagem(long id, MultipartFile file) throws IOException {
        String uploadDIR = "uploads/fotosUsuarios";

        Path uploadPath = Paths.get(uploadDIR);
        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path caminho = uploadPath.resolve(nomeArquivo);
        Files.copy(
                file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        usuario.setFotoPerfil(nomeArquivo);
        return usuarioRepository.save(usuario);
    }

    public Usuario cadastrar(Usuario usuario){
        if (usuarioRepository.existsByEmail(usuario.getEmail())){
            throw new IllegalArgumentException("Email ja Cadastrado");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        if (usuario.getRole() == null) {
            usuario.setRole(Role.HOSPEDE);
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario salvar(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listartodos(){
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorEmail(String email){
        return usuarioRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("Usuario não encontrado com o email: " + email));
    }

    public  Usuario buscarPorId(Long id){
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario atualizar(Long id, Usuario usuarioAtualizado){
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));

        if (usuarioAtualizado.getTelefone() != null && !usuarioAtualizado.getTelefone().isEmpty()) {
            usuario.setTelefone(usuarioAtualizado.getTelefone());
        }

        if (usuarioAtualizado.getFotoPerfil() != null && !usuarioAtualizado.getFotoPerfil().isEmpty()) {
            usuario.setFotoPerfil(usuarioAtualizado.getFotoPerfil());
        }


        if (usuarioAtualizado.getEmail() != null && !usuarioAtualizado.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(usuarioAtualizado.getEmail())){
                throw new IllegalArgumentException("Email ja cadastrado");
            }
            usuario.setEmail(usuarioAtualizado.getEmail());
        }

        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }

        return usuarioRepository.save(usuario);
    }

    public void deletar(Usuario usuario){
        usuarioRepository.delete(usuario);
    }

    public void deletarPorId(Long id){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Login não encontrado"));
        usuarioRepository.delete(usuario);
    }

    public Usuario autenticar(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));

        if (usuario != null && passwordEncoder.matches(senha, usuario.getSenha())) {
            return usuario;
        } else {
            throw new IllegalArgumentException("Senha incorreta");
        }

    }

    public boolean verificarSenha(String email, String senha){
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));
        if (usuario == null){
            return false;
        }

        return passwordEncoder.matches(senha, usuario.getSenha());
    }

}
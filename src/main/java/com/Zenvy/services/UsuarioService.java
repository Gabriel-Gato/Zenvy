package com.Zenvy.services;


import com.Zenvy.exceptions.BusinessException;
import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.enums.Role;
import com.Zenvy.models.Usuario;
import com.Zenvy.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public Usuario salvarImagem(long id, MultipartFile file) throws IOException {
        var uploadDIR = "uploads/fotosUsuarios";

        var uploadPath = Paths.get(uploadDIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        var nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
        var caminho = uploadPath.resolve(nomeArquivo);
        Files.copy(
                file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

        var usuario = usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado"));

        usuario.setFotoPerfil(nomeArquivo);
        return usuarioRepository.save(usuario);
    }

    public Usuario cadastrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new BusinessException("Email ja Cadastrado");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        if (usuario.getRole() == null) {
            usuario.setRole(Role.HOSPEDE);
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listartodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado com o email: " + email));
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado"));

        if (usuarioAtualizado.getTelefone() != null && !usuarioAtualizado.getTelefone().isEmpty()) {
            usuario.setTelefone(usuarioAtualizado.getTelefone());
        }

        if (usuarioAtualizado.getFotoPerfil() != null && !usuarioAtualizado.getFotoPerfil().isEmpty()) {
            usuario.setFotoPerfil(usuarioAtualizado.getFotoPerfil());
        }


        if (usuarioAtualizado.getEmail() != null && !usuarioAtualizado.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(usuarioAtualizado.getEmail())) {
                throw new BusinessException("Email ja cadastrado");
            }
            usuario.setEmail(usuarioAtualizado.getEmail());
        }

        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }

        return usuarioRepository.save(usuario);
    }

    public void deletar(Usuario usuario) {
        usuarioRepository.delete(usuario);
    }

    public void deletarPorId(Long id) {
       if (!usuarioRepository.existsById(id)) {
           throw new ResourceNotFoundException("Usuário não encontrado");
       }
       usuarioRepository.deleteById(id);
    }

    public Usuario autenticar(String email, String senha) {
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado"));

        if (usuario != null && passwordEncoder.matches(senha, usuario.getSenha())) {
            return usuario;
        } else {
            throw new IllegalArgumentException("Senha incorreta");
        }

    }

    public boolean verificarSenha(String email, String senha) {
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado"));
        if (usuario == null) {
            return false;
        }

        return passwordEncoder.matches(senha, usuario.getSenha());
    }

}
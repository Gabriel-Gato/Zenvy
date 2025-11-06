package com.Zenvy.services;

import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.Galeria;
import com.Zenvy.repositories.GaleriaRepository;
import lombok.RequiredArgsConstructor;
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
public class GaleriaService {

    private final GaleriaRepository galeriaRepository;

    public Galeria salvarImagem(long id, MultipartFile file) throws IOException {
        var uploadDIR = "uploads/galeria";

        var uploadPath = Paths.get(uploadDIR);
        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        var nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
        var caminho = uploadPath.resolve(nomeArquivo);
        Files.copy(
                file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

        var galeria = galeriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Foto não encontrada"));

        galeria.setImagem(nomeArquivo);
        return galeriaRepository.save(galeria);
    }

    public Galeria salvar(Galeria galeria){
        return galeriaRepository.save(galeria);
    }

    public List<Galeria> listarTodos(){
        return galeriaRepository.findAll();
    }

    public Galeria buscarPorId(Long id){
        return galeriaRepository.findById(id).orElse(null);
    }

    public Galeria atualizar(Long id, Galeria galeriaAtualizada){
        var galeria = galeriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Foto não encontrada"));

        if(galeriaAtualizada.getImagem() != null)
            galeria.setImagem(galeriaAtualizada.getImagem());

        return galeriaRepository.save(galeria);
    }

    public void deletar(Galeria galeria){
        galeriaRepository.delete(galeria);
    }

    public void deletarPorId(Long id){
        var galeria = galeriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Foto não encontrada"));
        galeriaRepository.delete(galeria);
    }
}

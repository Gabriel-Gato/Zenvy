package com.Zenvy.Service;

import com.Zenvy.Model.Galeria;
import com.Zenvy.Repository.GaleriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
public class GaleriaService {

    @Autowired
    private GaleriaRepository galeriaRepository;

    public Galeria salvarImagem(long id, MultipartFile file) throws IOException {
        String uploadDIR = "uploads/galeria";

        Path uploadPath = Paths.get(uploadDIR);
        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path caminho = uploadPath.resolve(nomeArquivo);
        Files.copy(
                file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

        Galeria galeria = galeriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Foto não encontrada"));

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
        Galeria galeria = galeriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Foto não encontrada"));

        if(galeriaAtualizada.getImagem() != null)
            galeria.setImagem(galeriaAtualizada.getImagem());

        return galeriaRepository.save(galeria);
    }

    public void deletar(Galeria galeria){
        galeriaRepository.delete(galeria);
    }

    public void deletarPorId(Long id){
        Galeria galeria = galeriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Foto não encontrada"));
        galeriaRepository.delete(galeria);
    }



}

package com.Zenvy.services;


import com.Zenvy.models.Imovel;
import com.Zenvy.models.Usuario;
import com.Zenvy.repositories.ImovelRepository;
import com.Zenvy.repositories.UsuarioRepository;
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
public class ImovelService {

    @Autowired
    private ImovelRepository imovelRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Imovel salvarImagem(long id, MultipartFile file) throws IOException {
        String uploadDIR = "uploads/imagemImoveis";

        Path uploadPath = Paths.get(uploadDIR);
        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path caminho = uploadPath.resolve(nomeArquivo);
        Files.copy(
                file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

        Imovel imovel = imovelRepository.findById(id).orElseThrow(() -> new RuntimeException("Imovel não encontrado"));

        imovel.setImagem(nomeArquivo);
        return imovelRepository.save(imovel);
    }


    public Imovel cadastrar(Imovel imovel) {
        if (imovel.getAnfitriao() == null || imovel.getAnfitriao().getId() == null) {
            throw new IllegalArgumentException("O imóvel deve ter um anfitrião válido.");
        }

        Usuario anfitriao = usuarioRepository.findById(imovel.getAnfitriao().getId())
                .orElseThrow(() -> new IllegalArgumentException("Anfitrião não encontrado."));

        imovel.setAnfitriao(anfitriao);
        return imovelRepository.save(imovel);
    }


    public Imovel atualizar(Long id, Imovel imovelAtualizado) {
        Imovel imovel = imovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado."));

        if (imovelAtualizado.getNome() != null)
            imovel.setNome(imovelAtualizado.getNome());

        if (imovelAtualizado.getDescricao() != null)
            imovel.setDescricao(imovelAtualizado.getDescricao());

        if (imovelAtualizado.getLocalizacao() != null)
            imovel.setLocalizacao(imovelAtualizado.getLocalizacao());

        if (imovelAtualizado.getPrecoPorNoite() != null)
            imovel.setPrecoPorNoite(imovelAtualizado.getPrecoPorNoite());

        if (imovelAtualizado.getCapacidadeHospedes() != null)
            imovel.setCapacidadeHospedes(imovelAtualizado.getCapacidadeHospedes());

        if (imovelAtualizado.getQuartos() != null)
            imovel.setQuartos(imovelAtualizado.getQuartos());

        if (imovelAtualizado.getCozinha() != null)
            imovel.setCozinha(imovelAtualizado.getCozinha());

        if (imovelAtualizado.getSalaDeEstar() != null)
            imovel.setSalaDeEstar(imovelAtualizado.getSalaDeEstar());

        if (imovelAtualizado.getImagem() != null)
            imovel.setImagem(imovelAtualizado.getImagem());

        if (imovelAtualizado.getComodidades() != null)
            imovel.setComodidades(imovelAtualizado.getComodidades());

        return imovelRepository.save(imovel);
    }


    public Imovel buscarPorId(Long id) {
        return imovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado."));
    }


    public List<Imovel> listarTodos() {
        return imovelRepository.findAll();
    }


    public void deletar(Long id) {
        Imovel imovel = imovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado."));
        imovelRepository.delete(imovel);
    }

}


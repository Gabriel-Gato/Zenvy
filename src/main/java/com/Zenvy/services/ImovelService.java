package com.Zenvy.services;


import com.Zenvy.exceptions.BusinessException;
import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.Imovel;
import com.Zenvy.repositories.ImovelRepository;
import com.Zenvy.repositories.UsuarioRepository;
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
public class ImovelService {

    private final ImovelRepository imovelRepository;
    private final UsuarioRepository usuarioRepository;

    public Imovel salvarImagem(long id, MultipartFile file) throws IOException {
        var uploadDIR = "uploads/imagemImoveis";

        var uploadPath = Paths.get(uploadDIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        var nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
        var caminho = uploadPath.resolve(nomeArquivo);
        Files.copy(
                file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

        var imovel = imovelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Imovel não encontrado"));

        imovel.setImagem(nomeArquivo);
        return imovelRepository.save(imovel);
    }


    public Imovel cadastrar(Imovel imovel) {
        if (imovel.getAnfitriao() == null || imovel.getAnfitriao().getId() == null) {
            throw new BusinessException("O imóvel deve ter um anfitrião válido.");
        }

        var anfitriao = usuarioRepository.findById(imovel.getAnfitriao().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Anfitrião não encontrado."));

        imovel.setAnfitriao(anfitriao);
        return imovelRepository.save(imovel);
    }


    public Imovel atualizar(Long id, Imovel imovelAtualizado) {
        var imovel = imovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado."));

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
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado."));
    }


    public List<Imovel> listarTodos() {
        return imovelRepository.findAll();
    }


    public void deletar(Long id) {
        var imovel = imovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado."));
        imovelRepository.delete(imovel);
    }
}


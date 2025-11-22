package com.Zenvy.services;


import com.Zenvy.dto.FiltroImovelRequest;
import com.Zenvy.dto.ImovelResponseDTO;
import com.Zenvy.exceptions.BusinessException;
import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.Imovel;
import com.Zenvy.models.ImovelSpecification;
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
    private final AvaliacaoService avaliacaoService;

    public Imovel salvarImagens(long id, List<MultipartFile> files) throws IOException {
        var uploadDIR = "uploads/imagemImoveis";
        var uploadPath = Paths.get(uploadDIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        var imovel = imovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado"));

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            var nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
            var caminho = uploadPath.resolve(nomeArquivo);

            Files.copy(file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);
            imovel.getImagens().add(nomeArquivo);
        }

        return imovelRepository.save(imovel);
    }

    public List<Imovel> filtrarImoveis(FiltroImovelRequest filtro) {
        return imovelRepository.findAll(ImovelSpecification.comFiltros(filtro));
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

        if (imovelAtualizado.getImagens() != null)
            imovel.setImagens(imovelAtualizado.getImagens());

        if (imovelAtualizado.getComodidades() != null)
            imovel.setComodidades(imovelAtualizado.getComodidades());

        return imovelRepository.save(imovel);
    }


    public ImovelResponseDTO buscarPorId(Long id) {
        String baseUrl = "http://localhost:8080/uploads/imagemImoveis/";

        Imovel imovel = imovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado."));


        List<String> fotos = imovel.getImagens() != null
                ? imovel.getImagens().stream()
                .map(img -> baseUrl + img)
                .toList()
                : List.of();

        return new ImovelResponseDTO(
                imovel.getId(),
                imovel.getNome(),
                imovel.getLocalizacao(),
                imovel.getPrecoPorNoite(),
                fotos,
                avaliacaoService.calcularMediaPorImovel(imovel.getId()),
                imovel.getCapacidadeHospedes(),
                imovel.getQuartos(),
                imovel.getDescricao(),
                imovel.getComodidades()
        );

    }

    public List<ImovelResponseDTO> listarTodos() {
        String baseUrl = "http://localhost:8080/uploads/imagemImoveis/";

        return imovelRepository.findAll().stream()
                .map(imovel -> {
                    List<String> fotos = imovel.getImagens() != null
                            ? imovel.getImagens().stream()
                            .map(img -> baseUrl + img)
                            .toList()
                            : List.of();

                    return new ImovelResponseDTO(
                            imovel.getId(),
                            imovel.getNome(),
                            imovel.getLocalizacao(),
                            imovel.getPrecoPorNoite(),
                            fotos,
                            avaliacaoService.calcularMediaPorImovel(imovel.getId()),
                            imovel.getCapacidadeHospedes(),
                            imovel.getQuartos(),
                            imovel.getDescricao(),
                            imovel.getComodidades()
                    );

                })
                .toList();
    }



    public void deletarPorId(Long id) {
        if (!imovelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Imóvel não encontrado.");
        }
        imovelRepository.deleteById(id);
    }



}


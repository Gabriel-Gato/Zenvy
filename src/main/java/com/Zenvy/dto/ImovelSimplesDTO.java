package com.Zenvy.dto;

import com.Zenvy.models.Imovel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ImovelSimplesDTO {
    private Long id;
    private String nome;
    private String localizacao;
    private Double precoPorNoite;
    private List<String> imagens;
    private Double avaliacaoMedia;

    public ImovelSimplesDTO(Imovel imovel) {
        this.id = imovel.getId();
        this.nome = imovel.getNome();
        this.localizacao = imovel.getLocalizacao();
        this.precoPorNoite = imovel.getPrecoPorNoite();
        this.imagens = imovel.getImagens();

        var avaliacoes = imovel.getAvaliacoes();
        if (avaliacoes == null || avaliacoes.isEmpty()) {
            this.avaliacaoMedia = 0.0;
        } else {
            this.avaliacaoMedia = avaliacoes.stream()
                    .mapToDouble(a -> a.getNota() != null ? a.getNota() : 0.0)
                    .average()
                    .orElse(0.0);
        }
    }
}


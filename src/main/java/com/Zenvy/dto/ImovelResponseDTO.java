package com.Zenvy.dto;

import com.Zenvy.models.Imovel;
import com.Zenvy.models.enums.Comodidade;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ImovelResponseDTO {
    private Long id;
    private String nome;
    private String localizacao;
    private Double precoPorNoite;
    private List<String> fotos;
    private Double avaliacaoMedia;
    private Integer capacidadeHospedes;
    private Integer quartos;
    private String descricao;
    private List<Comodidade> comodidades;

    // Construtor que recebe Imovel
    public ImovelResponseDTO(Imovel imovel) {
        this.id = imovel.getId();
        this.nome = imovel.getNome();
        this.localizacao = imovel.getLocalizacao();
        this.precoPorNoite = imovel.getPrecoPorNoite();
        this.fotos = imovel.getImagens();
        this.capacidadeHospedes = imovel.getCapacidadeHospedes();
        this.quartos = imovel.getQuartos();
        this.descricao = imovel.getDescricao();
        this.comodidades = imovel.getComodidades();

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






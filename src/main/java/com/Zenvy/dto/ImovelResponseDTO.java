package com.Zenvy.dto;

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
}

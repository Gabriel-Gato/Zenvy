package com.Zenvy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ImovelResponseDTO {
    private Long id;
    private String titulo;
    private String localizacao;
    private Double valorDiaria;
    private String fotoPrincipalUrl;
    private Double avaliacaoMedia;
}

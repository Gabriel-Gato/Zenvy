package com.Zenvy.dto;

import com.Zenvy.models.Avaliacao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvaliacaoDTO {
    private Long id;
    private Integer nota;
    private String comentario;
    private String nomeUsuario;

    public AvaliacaoDTO(Avaliacao avaliacao) {
        this.id = avaliacao.getId();
        this.nota = avaliacao.getNota();
        this.comentario = avaliacao.getComentario();
        this.nomeUsuario = avaliacao.getAutor() != null ? avaliacao.getAutor().getNome() : "Anônimo";
    }
}

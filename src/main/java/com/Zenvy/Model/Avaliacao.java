package com.Zenvy.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Avaliacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "imovel_id")
    private Imovel imovel;

    @ManyToOne
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @Column
    private Integer nota; // 1 a 5 estrelas

    @Column
    private String comentario;

    @Column(nullable = false)
    private LocalDate dataAvaliacao;

    public Avaliacao() {
    }

    public Avaliacao(Long id, Imovel imovel, Usuario autor, Integer nota, String comentario, LocalDate dataAvaliacao) {
        this.id = id;
        this.imovel = imovel;
        this.autor = autor;
        this.nota = nota;
        this.comentario = comentario;
        this.dataAvaliacao = dataAvaliacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Imovel getImovel() {
        return imovel;
    }

    public void setImovel(Imovel imovel) {
        this.imovel = imovel;
    }

    public Usuario getAutor() {
        return autor;
    }

    public void setAutor(Usuario autor) {
        this.autor = autor;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDate getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDate dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}


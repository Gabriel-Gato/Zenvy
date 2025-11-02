package com.Zenvy.Model;
import jakarta.persistence.*;

@Entity
public class Galeria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imagem;

    public Galeria() {
    }

    public Galeria(Long id, String imagem) {
        this.id = id;
        this.imagem = imagem;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }
}

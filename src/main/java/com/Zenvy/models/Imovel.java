package com.Zenvy.models;

import com.Zenvy.models.enums.Comodidade;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Imovel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private String localizacao;

    @Column(nullable = false)
    private Double precoPorNoite;

    @Column(nullable = false)
    private Integer capacidadeHospedes;

    @Column(nullable = false)
    private Integer quartos;

    @Column(nullable = false)
    private Integer cozinha;

    @Column(nullable = false)
    private Integer salaDeEstar;

    @ElementCollection
    @CollectionTable(name = "imovel_imagens", joinColumns = @JoinColumn(name = "imovel_id"))
    @Column(name = "nome arquivo", nullable = false)
    private List<String> imagens = new ArrayList<>();


    @ElementCollection(targetClass = Comodidade.class)
    @Enumerated(EnumType.STRING)
    private List<Comodidade> comodidades;

    @ManyToOne
    @JoinColumn(name = "anfitriao_id")
    private Usuario anfitriao;

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL)
    private List<Reserva> reservas;

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacoes;
}

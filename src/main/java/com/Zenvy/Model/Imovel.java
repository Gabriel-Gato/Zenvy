package com.Zenvy.Model;

import com.Zenvy.Model.Enum.Comodidade;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false)
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

    @Column(nullable = false)
    private String imagem;

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

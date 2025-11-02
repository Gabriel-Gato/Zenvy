package com.Zenvy.Model;

import com.Zenvy.Model.Enum.Comodidade;
import jakarta.persistence.*;
import java.util.List;

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


    public Imovel() {
    }

    public Imovel(Long id, String nome, String descricao, String localizacao, Double precoPorNoite, Integer capacidadeHospedes, Integer quartos, Integer cozinha, Integer salaDeEstar, String imagem, List<Comodidade> comodidades, Usuario anfitriao, List<Reserva> reservas, List<Avaliacao> avaliacoes) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.localizacao = localizacao;
        this.precoPorNoite = precoPorNoite;
        this.capacidadeHospedes = capacidadeHospedes;
        this.quartos = quartos;
        this.cozinha = cozinha;
        this.salaDeEstar = salaDeEstar;
        this.imagem = imagem;
        this.comodidades = comodidades;
        this.anfitriao = anfitriao;
        this.reservas = reservas;
        this.avaliacoes = avaliacoes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public Double getPrecoPorNoite() {
        return precoPorNoite;
    }

    public void setPrecoPorNoite(Double precoPorNoite) {
        this.precoPorNoite = precoPorNoite;
    }

    public Integer getCapacidadeHospedes() {
        return capacidadeHospedes;
    }

    public void setCapacidadeHospedes(Integer capacidadeHospedes) {
        this.capacidadeHospedes = capacidadeHospedes;
    }

    public Integer getQuartos() {
        return quartos;
    }

    public void setQuartos(Integer quartos) {
        this.quartos = quartos;
    }

    public Integer getCozinha() {
        return cozinha;
    }

    public void setCozinha(Integer cozinha) {
        this.cozinha = cozinha;
    }

    public Integer getSalaDeEstar() {
        return salaDeEstar;
    }

    public void setSalaDeEstar(Integer salaDeEstar) {
        this.salaDeEstar = salaDeEstar;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public List<Comodidade> getComodidades() {
        return comodidades;
    }

    public void setComodidades(List<Comodidade> comodidades) {
        this.comodidades = comodidades;
    }

    public Usuario getAnfitriao() {
        return anfitriao;
    }

    public void setAnfitriao(Usuario anfitriao) {
        this.anfitriao = anfitriao;
    }

    public List<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
    }

    public List<Avaliacao> getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(List<Avaliacao> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }
}

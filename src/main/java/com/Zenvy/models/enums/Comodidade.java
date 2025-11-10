package com.Zenvy.models.enums;

public enum Comodidade {
    WIFI("Wi-Fi"),
    AR_CONDICIONADO("Ar-condicionado"),
    AQUECIMENTO("Aquecimento"),
    TV("TV"),
    VENTILADOR("Ventilador"),
    ROUPAS_DE_CAMA("Roupas de cama"),
    TOALHAS("Toalhas"),
    FERRO_DE_PASSAR("Ferro de passar"),
    MAQUINA_DE_LAVAR("Máquina de lavar"),
    COZINHA_COMPLETA("Cozinha completa"),
    GELADEIRA("Geladeira"),
    FOGAO("Fogão"),
    MICROONDAS("Micro-ondas"),
    CAFETEIRA("Cafeteira"),
    PISCINA("Piscina"),
    ESTACIONAMENTO("Estacionamento"),
    GARAGEM_COBERTA("Garagem coberta"),
    VARANDA("Varanda"),
    QUINTAL_JARDIM("Quintal / Jardim"),
    CHURRASQUEIRA("Churrasqueira"),
    PET_FRIENDLY("Pet friendly"),
    BERCO("Berço"),
    CADEIRA_BEBE("Cadeira de bebê"),
    ELEVADOR("Elevador"),
    BANHEIRO_ACESSIVEL("Banheiro acessível");

    private final String nome;

    Comodidade(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}

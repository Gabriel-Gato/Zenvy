package com.Zenvy.Model.Enum;


//Adicionar as imagens dps, para ter um icone para as comodidades
public enum Comodidade {
    WIFI("Wi-Fi", "wifi.png"),
    AR_CONDICIONADO("Ar-condicionado", "ar.png"),
    AQUECIMENTO("Aquecimento", "aquecimento.png"),
    TV("TV", "tv.png"),
    VENTILADOR("Ventilador", "ventilador.png"),
    ROUPAS_DE_CAMA("Roupas de cama", "cama.png"),
    TOALHAS("Toalhas", "toalha.png"),
    FERRO_DE_PASSAR("Ferro de passar", "ferro.png"),
    MAQUINA_DE_LAVAR("Máquina de lavar", "maquina-lavar.png"),
    COZINHA_COMPLETA("Cozinha completa", "cozinha.png"),
    GELADEIRA("Geladeira", "geladeira.png"),
    FOGAO("Fogão", "fogao.png"),
    MICROONDAS("Micro-ondas", "microondas.png"),
    CAFETEIRA("Cafeteira", "cafe.png"),
    PISCINA("Piscina", "piscina.png"),
    ESTACIONAMENTO("Estacionamento", "estacionamento.png"),
    GARAGEM_COBERTA("Garagem coberta", "garagem.png"),
    VARANDA("Varanda", "varanda.png"),
    QUINTAL_JARDIM("Quintal / Jardim", "jardim.png"),
    CHURRASQUEIRA("Churrasqueira", "churrasqueira.png"),
    PET_FRIENDLY("Pet friendly", "pet.png"),
    BERCO("Berço", "berco.png"),
    CADEIRA_BEBE("Cadeira de bebê", "cadeira-bebe.png"),
    ELEVADOR("Elevador", "elevador.png"),
    BANHEIRO_ACESSIVEL("Banheiro acessível", "banheiro-acessivel.png");

    private final String nome;
    private final String icone;

    Comodidade(String nome, String icone) {
        this.nome = nome;
        this.icone = icone;
    }

    public String getNome() { return nome; }
    public String getIcone() { return icone; }
}


package com.Zenvy.dto;

import com.Zenvy.models.enums.Comodidade;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public record FiltroImovelRequest(
        @Size(max = 255, message = "A localização deve ter no máximo 255 caracteres")
        String localizacao,

        @Positive(message = "O preço máximo deve ser um valor positivo")
        @DecimalMin(value = "0.01", message = "O preço máximo deve ser maior que zero")
        Double precoMaximo,

        @Positive(message = "A capacidade mínima deve ser um valor positivo")
        @Min(value = 1, message = "A capacidade mínima deve ser pelo menos 1")
        Integer capacidadeMinima,

        @Positive(message = "O número de quartos mínimos deve ser um valor positivo")
        @Min(value = 1, message = "O número de quartos mínimos deve ser pelo menos 1")
        Integer quartosMinimos,

        List<Comodidade> comodidades
) {
}

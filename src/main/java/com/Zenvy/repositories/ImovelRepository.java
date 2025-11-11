package com.Zenvy.repositories;


import com.Zenvy.models.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImovelRepository extends JpaRepository<Imovel, Long> {
    List<Imovel> findByPrecoPorNoiteBetweenAndCapacidadeHospedesBetweenAndQuartosBetweenAndLocalizacaoContainingIgnoreCase(
            Double precoMin, Double precoMax,
            Integer capacidadeMin, Integer capacidadeMax,
            Integer quartosMin, Integer quartosMax,
            String localizacao
    );
}

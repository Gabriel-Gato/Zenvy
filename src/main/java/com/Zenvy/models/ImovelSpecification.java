package com.Zenvy.models;

import com.Zenvy.dto.FiltroImovelRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class ImovelSpecification {
    public static Specification<Imovel> comFiltros(FiltroImovelRequest filtro) {
        return (root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();

            if (filtro.localizacao() != null && !filtro.localizacao().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("localizacao")), "%" + filtro.localizacao().toLowerCase() + "%"));
            }

            if (filtro.precoMaximo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("precoPorNoite"), filtro.precoMaximo()));
            }

            if (filtro.capacidadeMinima() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("capacidadeHospedes"), filtro.capacidadeMinima()));
            }

            if (filtro.quartosMinimos() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("quartos"), filtro.quartosMinimos()));
            }

            if (filtro.comodidade() != null) {
                // Filtra imóveis que contenham a comodidade
                var join = root.join("comodidades");
                predicates.add(cb.equal(join, filtro.comodidade()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

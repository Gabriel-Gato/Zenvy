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

            if (filtro.comodidades() != null && !filtro.comodidades().isEmpty()) {
                var join = root.join("comodidades");
                predicates.add(join.in(filtro.comodidades()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

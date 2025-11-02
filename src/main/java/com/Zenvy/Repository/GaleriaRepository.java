package com.Zenvy.Repository;

import com.Zenvy.Model.Galeria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GaleriaRepository extends JpaRepository<Galeria, Long> {
}

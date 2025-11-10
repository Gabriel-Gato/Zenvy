package com.Zenvy.repositories;

import com.Zenvy.models.Usuario;
import com.Zenvy.models.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByRole(Role role);
    boolean existsByEmail(String email);
    Optional<Usuario> findByEmail(String email);
    
}

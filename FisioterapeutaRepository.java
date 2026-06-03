package com.kinetix.repository;

import com.kinetix.model.Fisioterapeuta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FisioterapeutaRepository extends JpaRepository<Fisioterapeuta, Long> {
    // Métodos de busca específicos para Fisioterapeuta, se necessário
}
package com.kinetix.repository;

import com.kinetix.model.Exercicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {
    // Métodos de busca específicos para Exercicio, se necessário
}
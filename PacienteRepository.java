package com.kinetix.repository;

import com.kinetix.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    // Métodos de busca específicos para Paciente, se necessário
}
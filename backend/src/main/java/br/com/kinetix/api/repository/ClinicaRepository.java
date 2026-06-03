package br.com.kinetix.api.repository;

import br.com.kinetix.api.domain.Clinica;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicaRepository extends JpaRepository<Clinica, Long> {
}

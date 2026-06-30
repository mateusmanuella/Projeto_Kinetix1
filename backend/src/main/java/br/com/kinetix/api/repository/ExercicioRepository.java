package br.com.kinetix.api.repository;

import br.com.kinetix.api.domain.Exercicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {
}

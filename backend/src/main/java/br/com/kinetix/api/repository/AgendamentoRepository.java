package br.com.kinetix.api.repository;

import br.com.kinetix.api.domain.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
}

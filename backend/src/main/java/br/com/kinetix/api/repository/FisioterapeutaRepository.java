package br.com.kinetix.api.repository;

import br.com.kinetix.api.domain.Fisioterapeuta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FisioterapeutaRepository extends JpaRepository<Fisioterapeuta, Long> {
}

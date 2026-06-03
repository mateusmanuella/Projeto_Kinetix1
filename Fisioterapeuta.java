package com.kinetix.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "fisioterapeuta")
public class Fisioterapeuta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String crefito;
}
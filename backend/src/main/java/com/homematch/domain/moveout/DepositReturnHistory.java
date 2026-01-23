package com.homematch.domain.moveout;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deposit_return_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class DepositReturnHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deposit_management_id", nullable = false)
    private DepositManagement depositManagement;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; // NOTICE_SENT, LEGAL_ACTION, RETURNED 등

    @Column(name = "action_date", nullable = false)
    private LocalDate actionDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "document_url", length = 500)
    private String documentUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

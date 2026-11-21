package com.rudolfo.api_chamados.seed;

import com.rudolfo.api_chamados.model.Chamado;
import com.rudolfo.api_chamados.model.Prioridade;
import com.rudolfo.api_chamados.model.Status;
import com.rudolfo.api_chamados.repository.ChamadoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class GeradorDeChamados implements CommandLineRunner {

    private final ChamadoRepository chamadoRepository;
    private final Random random = new Random();

    public GeradorDeChamados(ChamadoRepository chamadoRepository){
        this.chamadoRepository = chamadoRepository;
    }
    @Override
    public void run(String... args) throws Exception {
        if (chamadoRepository.count() > 0) {
            return;
        }
        String[] setores = {"Recepção", "Financeiro", "Diretoria", "Rh", "Comercial", "Marketing"};
        String[] categorias = {"Rede", "Impressora", "Computador", "Email", "Sistema", "Liberação"};
        String[] tecnicos = {"Bruno", "Pedro", "João", "Carlos", "Anderson"};
        Prioridade[] prioridades = Prioridade.values();

        List<Chamado> chamados = new ArrayList<>();

        for(int i = 0 ; i < 2000 ; i++){
            Chamado chamado = new Chamado();
            chamado.setSetor(setores[random.nextInt(setores.length)]);
            chamado.setPrioridade(prioridades[random.nextInt(prioridades.length)]);
            String categoria = categorias[random.nextInt(categorias.length)];
            chamado.setCategoria(categoria);
            chamado.setTitulo("Problema de " + categoria);
            chamado.setTecnico(tecnicos[random.nextInt(tecnicos.length)]);
            LocalDateTime dataAbertura = LocalDateTime.now()
                    .minusDays(random.nextInt(180))
                    .withHour(8 + random.nextInt(10))
                    .withMinute(random.nextInt(60));

            chamado.setDataAbertura(dataAbertura);
            if (random.nextInt(100) < 85){
                chamado.setStatus(Status.FECHADO);
                chamado.setDataFechamento(dataAbertura.plusMinutes(15 + random.nextInt(480)));
            }else {
                chamado.setStatus(Status.ABERTO);
            }


            chamados.add(chamado);
        }
        chamadoRepository.saveAll(chamados);
    }
}

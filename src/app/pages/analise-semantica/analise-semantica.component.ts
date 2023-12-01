import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { gramaticaLALG } from 'src/app/gramatica/gramaticaLALG';
import { AnalisadorGramaticalService } from 'src/app/services/analisador-gramatical/analisador-gramatical.service';
import { AnalisadorLexicoService } from 'src/app/services/analisador-lexico/analisador-lexico.service';
import { AnalisadorSemanticoService } from 'src/app/services/analisador-semantico/analisador-semantico.service';

@Component({
  selector: 'app-analise-semantica',
  templateUrl: './analise-semantica.component.html',
  styleUrls: ['./analise-semantica.component.scss'],
})
export class AnaliseSemanticaComponent implements OnInit {
  @ViewChild('tokensDrawer') drawerElement: MatDrawer;

  constructor(
    public analisadorLexico: AnalisadorLexicoService,
    private analisadorGramatical: AnalisadorGramaticalService,
    private analisadorSemantico: AnalisadorSemanticoService
  ) {}

  ngOnInit(): void {
    const selectedGrammar = gramaticaLALG;
    // this.analisadorGramatical.selectGrammar(selectedGrammar);
    console.log({ selectedGrammar });
    // console.log(this.analisadorSemantico.tabelaDeSimbolos);
    const codigoLALG = `
  program teste;
  int alfa, beta;
  boolean omega;

  procedure meuProcedimento(var x: int; y: boolean);
  begin
    // Corpo do procedimento
  end;

  begin
    alfa:=false;
    beta:= 1 + 1
  end.
`;
    this.analisadorSemantico.analisarPrograma(codigoLALG);
    console.log(this.analisadorSemantico.bloco);
  }

  ngAfterViewInit(): void {
    this.analisadorLexico.tokens$.subscribe((e) => {
      if (e.length === 0) {
        this.drawerElement.close();
      } else {
        this.analisadorGramatical.parse();
      }
    });
    console.log(this.analisadorSemantico.tabelaDeSimbolos);
  }
}

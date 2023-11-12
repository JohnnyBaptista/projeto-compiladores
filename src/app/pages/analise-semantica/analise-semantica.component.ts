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
    private analisadorSemantico: AnalisadorSemanticoService,
  ) {}

  ngOnInit(): void {
    const selectedGrammar = gramaticaLALG;
    this.analisadorGramatical.selectGrammar(selectedGrammar);
    this.analisadorSemantico.teste_jp();
    console.log(this.analisadorSemantico.tabelaDeSimbolos)
  }

  ngAfterViewInit(): void {
    this.analisadorLexico.tokens$.subscribe((e) => {
      if (e.length === 0) {
        this.drawerElement.close();
      } else {
        this.analisadorGramatical.parse();
      }
    });
    console.log(this.analisadorSemantico.tabelaDeSimbolos)
  }
}

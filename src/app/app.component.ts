import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import {Buffer} from 'buffer';
import * as dataCurve from '../assets/01.json';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-chart';
  chart: any = []
  jsonFile: any = dataCurve

  torqueFactor = 0
  angleFactor = 0
  displacementFactor = 0
  loadFactor = 0
  data : any
  load: Array<any> = []
  //angle: Array<any> = []
  torque: Array<any> = []

  constructor() {}

  ngOnInit() {
    Chart.register(annotationPlugin)
    Chart.register(zoomPlugin)
    this.torqueFactor = this.jsonFile.params.result.config.torque_factor
    this.angleFactor = this.jsonFile.params.result.config.angle_factor
    this.loadFactor = this.jsonFile.params.result.config.load_factor
    this.displacementFactor = this.angleFactor * 360. / 5.
    this.data = Buffer.from(this.jsonFile.params.result.data, 'base64')
    
    const B0 = this.jsonFile.params.result.points.B0
    const B0p = this.jsonFile.params.result.points["B0'"]
    const B1 = this.jsonFile.params.result.points.B1
    const B2 = this.jsonFile.params.result.points.B2
    const B3 = this.jsonFile.params.result.points.B3

    const S1 = this.jsonFile.params.result.points.S1
    const S2 = this.jsonFile.params.result.points.S2
    const S3 = this.jsonFile.params.result.points.S3
    const S4 = this.jsonFile.params.result.points.S4
    
    for( let i = 0 ; i < this.data.length / 8 ; i++ ) {
        console.log("Angle", i, this.data.readUInt16LE(i*8+4))

        if( i <= S1.idx)
          this.load.push({
            x: this.data.readUInt16LE(i*8+4) / this.displacementFactor,
            y: this.data.readInt16LE(i*8+2) / this.loadFactor
          })
        
        if( i >= B3.idx)
        this.torque.push({
          x: this.data.readUInt16LE(i*8+4) / this.angleFactor,
          y: this.data.readInt16LE(i*8+6) / this.torqueFactor
        })

       
    }
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
        //labels: [...Array(this.data.length / 8).keys()],
        //labels: this.angle,
        datasets: [
          {
            label: 'torque',
            data: this.torque,
            yAxisID: 'yTorque',
            xAxisID: 'xAngle'
          },
          {
            label: 'load',
            data: this.load,
            yAxisID: 'yLoad',
            xAxisID: 'xDisplacement',
          },
        ],
      },
      options: {
        scales: {
          xAngle: {
            position: 'top',
            //max: 2500
          },
          xDisplacement: {
            position: 'bottom',
            //max: 2500 * 5 / 360 
          },
          yTorque: {
            position: 'right'
          },
          yLoad: {
            position: 'left'
          }
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          },
          annotation: {
            annotations: {
              B3: {
                type: 'point',
                xValue: B3.X,
                yValue: B3.L,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                yScaleID: 'yLoad',
                xScaleID: 'xDisplacement',
              },
              B2: {
                type: 'point',
                xValue: B2.X,
                yValue: B2.L,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xDisplacement',
                yScaleID: 'yLoad',
              },
              B0: {
                type: 'point',
                xValue: B0.X,
                yValue: B0.L,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xDisplacement',
                yScaleID: 'yLoad',
              },
              B1: {
                type: 'point',
                xValue: B1.X,
                yValue: B1.L,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xDisplacement',
                yScaleID: 'yLoad',
              },
              B0p: {
                type: 'point',
                xValue: B0p.X,
                yValue: B0p.L,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xDisplacement',
                yScaleID: 'yLoad',
              },
              S1: {
                type: 'point',
                xValue: S1.A,
                yValue: S1.T,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xAngle',
                yScaleID: 'yTorque',
              },
              S2: {
                type: 'point',
                xValue: S2.A,
                yValue: S2.T,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xAngle',
                yScaleID: 'yTorque',
              },
              S3: {
                type: 'point',
                xValue: S3.A,
                yValue: S3.T,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xAngle',
                yScaleID: 'yTorque',
              },
              S4: {
                type: 'point',
                xValue: S4.A,
                yValue: S4.T,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                xScaleID: 'xAngle',
                yScaleID: 'yTorque',
              }
            }
          }
        }
      },
      
      
    });
  }
}

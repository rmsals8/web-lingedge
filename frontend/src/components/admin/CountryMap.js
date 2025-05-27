import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

/**
 * 국가별 방문자 지도 컴포넌트
 * @param {Object} props
 * @param {Object} props.data 국가별 방문자 데이터
 */
const CountryMap = ({ data }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // SVG 컨테이너 크기 가져오기
    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = 400;

    // SVG 요소 초기화
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 기존 요소 모두 제거
    svg.selectAll('*').remove();

    // 투영법 설정
    const projection = d3.geoNaturalEarth1()
      .scale(width / 5)
      .translate([width / 2, height / 2]);

    // 경로 생성자 설정
    const path = d3.geoPath().projection(projection);

    // 툴팁 요소 생성
    const tooltip = d3.select(tooltipRef.current);

    // 색상 스케일 설정
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(Object.values(data))]);

    // 세계 지도 데이터 로드
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then(response => response.json())
      .then(worldData => {
        const countries = feature(worldData, worldData.objects.countries).features;

        // 국가별 데이터와 지도 데이터 매핑
        const countryData = {};
        
        // 임시로 국가 코드와 국가 이름 매핑 (실제로는 API에서 더 정확한 데이터를 받아야 함)
        const countryNameToCode = {
          'South Korea': 'KOR',
          'United States': 'USA',
          'Japan': 'JPN',
          'China': 'CHN',
          'United Kingdom': 'GBR',
          'Germany': 'DEU',
          'France': 'FRA',
          'Canada': 'CAN',
          'Australia': 'AUS',
          'Russia': 'RUS'
          // 실제 구현 시 더 많은 국가 코드 추가 필요
        };

        // 국가별 데이터 매핑
        Object.keys(data).forEach(countryName => {
          const countryCode = countryNameToCode[countryName];
          if (countryCode) {
            countryData[countryCode] = data[countryName];
          }
        });

        // 지도 그리기
        svg.selectAll('path')
          .data(countries)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', d => {
            const value = countryData[d.id];
            return value ? colorScale(value) : '#eee';
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5)
          .on('mouseover', (event, d) => {
            const countryName = Object.keys(countryNameToCode).find(
              name => countryNameToCode[name] === d.id
            ) || 'Unknown';
            const value = countryData[d.id] || 0;
            
            tooltip.style('display', 'block')
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY + 10}px`)
              .html(`${countryName}: ${value.toLocaleString()} 방문자`);
          })
          .on('mouseout', () => {
            tooltip.style('display', 'none');
          });

        // 범례 추가
        const legendWidth = 200;
        const legendHeight = 20;
        
        const legendScale = d3.scaleLinear()
          .domain([0, d3.max(Object.values(data))])
          .range([0, legendWidth]);
          
        const legendAxis = d3.axisBottom(legendScale)
          .ticks(5)
          .tickFormat(d3.format('.0s'));
          
        const legend = svg.append('g')
          .attr('transform', `translate(${width - legendWidth - 20}, ${height - 40})`);
          
        const defs = legend.append('defs');
        const linearGradient = defs.append('linearGradient')
          .attr('id', 'gradient')
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '100%')
          .attr('y2', '0%');
          
        linearGradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', colorScale(0));
          
        linearGradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', colorScale(d3.max(Object.values(data))));
          
        legend.append('rect')
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .style('fill', 'url(#gradient)');
          
        legend.append('g')
          .attr('transform', `translate(0, ${legendHeight})`)
          .call(legendAxis);
          
        legend.append('text')
          .attr('x', legendWidth / 2)
          .attr('y', -5)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text('방문자 수');
      })
      .catch(error => {
        console.error('지도 데이터 로드 오류:', error);
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .text('지도 데이터를 불러올 수 없습니다');
      });

  }, [data]);

  return (
    <div className="country-map">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="map-tooltip" style={{ display: 'none' }}></div>
    </div>
  );
};

export default CountryMap;
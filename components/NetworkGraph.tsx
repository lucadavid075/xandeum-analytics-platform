import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ApiResponse, GraphNode, GraphLink, IpNodeDetail } from '../types';

interface NetworkGraphProps {
  data: ApiResponse | null;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Initial calculation
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    // 1. Prepare Data
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeSet = new Set<string>();

    // Process IP Nodes
    Object.entries(data.ip_nodes).forEach(([ip, details]: [string, IpNodeDetail]) => {
      if (!nodeSet.has(ip)) {
        nodes.push({ 
          id: ip, 
          group: 'ip', 
          status: details.status,
          val: 20 
        });
        nodeSet.add(ip);
      }

      // Process Pods connected to this IP
      if (details.pods) {
        details.pods.forEach(pod => {
          if (!nodeSet.has(pod.address)) {
            nodes.push({ 
              id: pod.address, 
              group: 'pnode', 
              val: 10 
            });
            nodeSet.add(pod.address);
          }
          links.push({ source: ip, target: pod.address });
        });
      }
    });

    // 2. Setup D3
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = dimensions.width;
    const height = dimensions.height;
    
    // Safety check to prevent NaN errors if dimensions aren't ready
    if (width === 0 || height === 0) return;

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200)) // Reduced repulsion slightly
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.05)) // Gentle pull to X center
      .force("y", d3.forceY(height / 2).strength(0.05)) // Gentle pull to Y center
      .force("collide", d3.forceCollide().radius(20));

    // Draw Lines (Links)
    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Draw Nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.group === 'ip' ? 8 : 5)
      .attr("fill", (d) => {
        if (d.group === 'ip') {
          return d.status === 'online' ? '#059669' : '#f43f5e';
        }
        return '#a78bfa'; // Purple for pNodes for better contrast
      })
      .call(drag(simulation) as any);

    // Tooltips
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(15, 23, 42, 0.95)")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("border", "1px solid #334155")
      .style("z-index", "20")
      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1)");

    node.on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`
          <div class="font-bold mb-1">${d.id}</div>
          <div class="text-slate-300 text-xs">
            ${d.group === 'ip' ? `Status: <span class="${d.status === 'online' ? 'text-emerald-400' : 'text-rose-400'}">${d.status?.toUpperCase()}</span>` : 'Type: pNode (Pod)'}
          </div>
        `);
    })
    .on("mousemove", (event) => {
      // Calculate relative position within the container to prevent overflow
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const x = event.clientX - containerRect.left + 15;
        const y = event.clientY - containerRect.top + 15;
        tooltip.style("top", `${y}px`).style("left", `${x}px`);
      }
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

    // Tick Function with Clamping
    simulation.on("tick", () => {
      const radius = 10; // Safe margin

      node
        .attr("cx", (d: any) => {
          // Clamp X to be within [radius, width - radius]
          return d.x = Math.max(radius, Math.min(width - radius, d.x));
        })
        .attr("cy", (d: any) => {
          // Clamp Y to be within [radius, height - radius]
          return d.y = Math.max(radius, Math.min(height - radius, d.y));
        });

      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
    });

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };

  }, [data, dimensions]);

  // Drag utility
  function drag(simulation: d3.Simulation<GraphNode, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden shadow-xl" ref={containerRef}>
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600 pointer-events-none select-none">
        <h3 className="text-white text-sm font-bold mb-2">Network Topology</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <span className="text-xs text-slate-300">Online IP Node</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="text-xs text-slate-300">Offline IP Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-400"></span>
          <span className="text-xs text-slate-300">pNode (Pod)</span>
        </div>
      </div>
      <svg ref={svgRef} width="100%" height="100%" className="cursor-move touch-none" />
    </div>
  );
};

export default NetworkGraph;
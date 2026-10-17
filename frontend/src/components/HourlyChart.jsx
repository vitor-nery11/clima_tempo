// frontend/src/components/HourlyChart.jsx
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export function HourlyChart({ data }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6">
      <h3 className="text-lg font-semibold mb-4">Variação nas próximas 24 horas</h3>
      
      {/* ResponsiveContainer faz o gráfico se adaptar à largura do celular ou PC */}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* Cria um efeito de degradê azul embaixo da linha do gráfico */}
            <defs>
              <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Eixo Horizontal (Horas: "00:00", "01:00"...) */}
            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              interval={3} // Mostra o horário de 3 em 3 horas para não embolar
            />

            {/* Eixo Vertical (Temperatura) oculto para deixar o visual limpo */}
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />

            {/* Balãozinho que aparece ao passar o mouse */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
              }}
              formatter={(value) => [`${value}°C`, 'Temperatura']}
            />

            {/* Linha curva principal */}
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#60a5fa"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#tempColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
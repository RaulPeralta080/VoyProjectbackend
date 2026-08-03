const { expect } = require('chai');

describe('Pruebas Unitarias - Cálculo de Métricas y Ventas de Eventos', () => {
  it('Debe calcular correctamente las entradas vendidas en base al stock y capacidad', () => {
    const mockEvent = {
      capacity: 250,
      stock: 180,
    };

    const ticketsSold = Math.max(0, mockEvent.capacity - mockEvent.stock);
    const fillRate = Math.round((ticketsSold / mockEvent.capacity) * 100);

    expect(ticketsSold).to.equal(70);
    expect(fillRate).to.equal(28);
  });

  it('Debe calcular con precisión los ingresos totales generados por un conjunto de shows', () => {
    const mockEvents = [
      { capacity: 100, stock: 40, price: 3000 },  // 60 vendidos * 3000 = 180,000
      { capacity: 200, stock: 150, price: 5000 }, // 50 vendidos * 5000 = 250,000
      { capacity: 50, stock: 50, price: 2500 }     // 0 vendidos = 0
    ];

    const totalRevenue = mockEvents.reduce((sum, e) => {
      const sold = Math.max(0, e.capacity - e.stock);
      return sum + (sold * e.price);
    }, 0);

    expect(totalRevenue).to.equal(430000);
  });
});

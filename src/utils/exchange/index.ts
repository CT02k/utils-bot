import axios from "axios";

const BASE = "https://api.fxratesapi.com";

type Currencies = {
  [code: string]: {
    code: string;
    name: string;
    decimal_digits: number;
  };
};

type Rate = {
  rates: {
    [code: string]: string;
  };
};

export async function getCurrencies(filter: string) {
  const res = await axios.get<Currencies>(`${BASE}/currencies`);
  const data = Object.entries(res.data).map(([code, data]) => ({ code, data }));

  return data
    .filter((currency) => {
      return (
        currency.code.toLowerCase().includes(filter.toLowerCase()) ||
        currency.data.name.toLowerCase().includes(filter.toLowerCase().trim())
      );
    })
    .slice(0, 25);
}

export async function getRate(value: string, from: string, to: string) {
  const resolveTo = to.match(/\(([^)]+)\)$/);
  const resolveFrom = from.match(/\(([^)]+)\)$/);

  const infoRes = await axios.get<Currencies>(`${BASE}/currencies`);
  const data = infoRes.data[resolveTo ? resolveTo[1] : to];

  const res = await axios.get<Rate>(`${BASE}/latest`, {
    params: {
      base: resolveFrom ? resolveFrom[1] : from,
      currencies: resolveTo ? resolveTo[1] : to,
    },
  });

  const rate = (
    parseFloat(value.replace(",", ".")) *
    Number(res.data.rates[resolveTo ? resolveTo[1] : to])
  ).toFixed(data.decimal_digits);

  return {
    rate,
    from: {
      data: {
        amount: value.replace(",", "."),
        code: resolveFrom ? resolveFrom[1] : from,
      },
    },
    to: {
      data,
    },
  };
}

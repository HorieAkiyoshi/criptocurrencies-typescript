import { useState, FormEvent, useEffect } from 'react'

import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'

export interface CoinProps{
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24H: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  volumeUsd24Hr: string;
  explore:string;
  marketCapUsd: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp{
  data: CoinProps[];
}

export default function Home() {

  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState(0);

  const navigate = useNavigate();
    
  useEffect(()=>{
    getData();
  },[offset])

  async function getData(){
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
    .then(response => response.json())
    .then((data: DataProp)=>{
      const coinsData = data.data;

      const price = Intl.NumberFormat("en-US",{
        style: "currency",
        currency: "USD"
      })

      const priceCompact = Intl.NumberFormat("en-US",{
        style: "currency",
        currency: "USD",
        notation: "compact",
      })

      const formatedResult = coinsData.map((item)=>{
        const formated ={
          ...item, 
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
        }
        return formated;
      })
      //console.log(formatedResult);

      const listCoins = [...coins, ...formatedResult];
      setCoins(listCoins);
    })
  }

  function handleSubmit(e: FormEvent){
    e.preventDefault();

    if(input === "")return;

    navigate(`/detail/${input}`);
  }

  function handleGetmore(){
    if(offset === 0){
      setOffset(10)
      return;
    }

    setOffset(offset + 10);
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          onChange={(e)=>setInput(e.target.value)}
          value={input}
          type='text'
          placeholder='Digite o nome da moeda... Ex bitcoin'
        />
        <button type='submit'>
          <BsSearch size={30} color='#fff'/>
        </button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th scope='col'>Name | Symbol</th>
            <th scope='col'>Market Cap</th>
            <th scope='col'>Price</th>
            <th scope='col'>Volume (24hr)</th>
            <th scope='col'>Change (24hr)</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {coins.length > 0 && coins.map((item)=>(
            <tr className={styles.tr} key={item.id}>
              <td className={styles.tdlabel} data-label="Moeda">
                <div className={styles.name}>
                  <img className={styles.logo} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`} alt="logo cripto" />
                  <Link to={`/detail/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol}
                  </Link>
                </div>
              </td>
              <td className={styles.tdlabel} data-label="Valor mercado">
                {item.formatedMarket}
              </td>
              <td className={styles.tdlabel} data-label="Preço">
                {item.formatedPrice}
              </td>
              <td className={styles.tdlabel} data-label="Volume">
                {item.formatedVolume}
              </td>
              <td className={Number(item.changePercent24Hr)> 0? styles.tdprofit : styles.tdloss} data-label="Mudança 24h">
                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.buttonMore} onClick={handleGetmore}>
        Carregar mais
      </button>
    </main>
  )
}

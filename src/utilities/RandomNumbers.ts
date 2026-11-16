import Images from "@/assets/Imagens";

function RandomNumber(): string[] {
  
  return Images[Math.floor(Math.random() * 30) + 1];
}

export default RandomNumber;
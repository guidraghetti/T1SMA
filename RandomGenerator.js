
//Métodos para gerar números pseudoaleátorios
class RandomGenerator {
  constructor (modulus, a, c) {
      this.modulus = modulus;
      this.a = a;
      this.c = c;
      this.seeds = [];
  }

  generateNumbers(m, a, c, seed){
    let z = seed;
    z = (a * z + c) % m;
  
    return z/m;
  };

  generateRandoms() {
    for (let i = 0; i < 100000; i++) {
      if (this.seeds.length === 0) {
        this.seeds[0] = this.generateNumbers(this.modulus, this.a, this.c, +new Date());
      } else {
        this.seeds[i] = this.generateNumbers(this.modulus, this.a, this.c, +new Date());
      }
    }
  }
  
}
module.exports = RandomGenerator;

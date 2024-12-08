class BinaryGenerator {
    cycleList(list, loops = 1) {
        let n = list.length;
        let result = [...list];
        for (let t = 0; t < loops; t++) {
            result = result.map((_, i) => result[(i + 1) % n]);
        }
        return result;
    }

    generateBinaryStrings(bitCount) {
        const binaryStrings = [];
        
        function genbin(n, bs = '') {
            if (bs.length === n) {
                binaryStrings.push(bs);
            } else {
                genbin(n, bs + '0');
                genbin(n, bs + '1');
            }
        }
        
        genbin(bitCount);
        return binaryStrings;
    }

    generateUniqueCombinations(L) {
        const combinations = this.generateBinaryStrings(L);
        const nonRepeating = [combinations[0]];
        
        for (let i = 0; i < combinations.length; i++) {
            const ref = combinations[i].split('');
            const N = ref.length;
            let test = 0;
            
            for (let j = 0; j < nonRepeating.length; j++) {
                for (let n = 0; n < N; n++) {
                    if (JSON.stringify(this.cycleList([...nonRepeating[j]], n + 1)) === JSON.stringify(ref)) {
                        test++;
                    }
                }
            }
            
            if (test === 0) {
                nonRepeating.push(combinations[i]);
            }
        }
        
        return nonRepeating.map(str => str.split('').map(Number));
    }
}

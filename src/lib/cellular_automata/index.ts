export type Rule = Array<number>

export function parseRules(rules: string): {birthRule: Rule, surviveRule: Rule} {
  let [birthRule, surviveRule] = rules.split('/').map(rule => rule.split('').map(i => parseInt(i)))
  
  return { birthRule, surviveRule }
}
export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  // Value objects não têm identidade: são iguais quando os valores são iguais.
  equals(valueObject: ValueObject<unknown>) {
    if (valueObject === this) {
      return true
    }

    return JSON.stringify(valueObject.props) === JSON.stringify(this.props)
  }
}

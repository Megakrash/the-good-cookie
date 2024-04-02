import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsCoordinates(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCoordinates',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (!Array.isArray(value) || value.length !== 2) {
            return false
          }
          let [latitude, longitude] = value
          latitude = parseFloat(latitude)
          longitude = parseFloat(longitude)

          if (isNaN(latitude) || isNaN(longitude)) {
            return false
          }

          return (
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
          )
        },
      },
    })
  }
}

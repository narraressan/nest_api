import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as duration from 'dayjs/plugin/duration';
import { ClassConstructor, plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { validateOrReject } from 'class-validator';

dayjs.extend(utc);
dayjs.extend(duration);

/**
 * map object to given clazz
 * excludeExtraneousValues: true - skips properties that doesn't exist in clazz but exists in obj, will require @Expose() decorat
 */
export const cast = async <T>(
  clazz: ClassConstructor<T>,
  obj: object,
): Promise<T> => {
  const toClass = plainToClass(clazz, obj, {
    excludeExtraneousValues: false,
  });
  await validateOrReject(toClass as unknown as object);
  return toClass;
};

export const enumVals = (_enum: { [x: string]: any }): string[] => {
  return Object.keys(_enum)
    .map((key) => _enum[key])
    .filter((key) => typeof key === 'string');
};

export const getServerTime = () => {
  return dayjs.utc();
};

// ref: https://github.com/norbornen/execution-time-decorator/blob/master/src/index.ts
export function logtime(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor,
): PropertyDescriptor {
  propertyDescriptor =
    propertyDescriptor || Object.getOwnPropertyDescriptor(target, propertyKey);

  const timername =
    (target instanceof Function
      ? `static ${target.name}`
      : target.constructor.name) + `::${propertyKey}`;
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = async function (...args: any[]) {
    const start = getServerTime();
    console.log(`[logtime] [${timername}]: begin`);
    try {
      const result = await originalMethod.apply(this, args);
      console.log(
        `[logtime] [${timername}]: ${dayjs
          .duration(getServerTime().diff(start))
          .asSeconds()}s`,
      );
      return result;
    } catch (err) {
      console.log(
        `[logtime] [${timername}]: ${dayjs
          .duration(getServerTime().diff(start))
          .asSeconds()}s`,
      );
      throw err;
    }
  };
  return propertyDescriptor;
}

export const getHashFromText = async (text: string): Promise<string> => {
  return await bcrypt.hash(text, parseInt(process.env.HASH_ROUNDS));
};

export type GenericClass<T = any> = new (...args: any[]) => T;

export const toMb = (size: number) => size * 1024 * 1024;

export const nullable = true;

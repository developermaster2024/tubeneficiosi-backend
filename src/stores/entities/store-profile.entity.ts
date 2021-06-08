import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Store } from "./store.entity";

@Entity({
  name: 'store_profiles',
})
export class StoreProfile {
  @OneToOne(() => Store, store => store.storeProfile, {primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_id'})
  store: Store;

  @Column({
    name: 'whatsapp',
    type: 'varchar',
    length: 50
  })
  whatsapp: string;

  @Column({
    name: 'instagram',
    type: 'varchar',
  })
  instagram: string;

  @Column({
    name: 'facebook',
    type: 'varchar',
  })
  facebook: string;

  @Column({
    name: 'youtube',
    type: 'varchar',
  })
  youtube: string;

  @Column({
    name: 'video_url',
    type: 'varchar',
  })
  videoUrl: string;

  @Column({
    name: 'short_description',
    type: 'varchar',
  })
  shortDescription: string;

  @Column({
    name: 'description',
    type: 'text',
  })
  description: string;

  @Column({
    name: 'banner',
    type: 'varchar',
  })
  banner: string;

  @Column({
    name: 'front_image',
    type: 'varchar',
  })
  frontImage: string;

  @Column({
    name: 'logo',
    type: 'varchar',
  })
  logo: string;
}
